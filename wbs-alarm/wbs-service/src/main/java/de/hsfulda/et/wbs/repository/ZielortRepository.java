package de.hsfulda.et.wbs.repository;

import de.hsfulda.et.wbs.core.data.ZielortData;
import de.hsfulda.et.wbs.entity.Zielort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ZielortRepository extends CrudRepository<Zielort, Long> {

    @Query("select z from Zielort z where z.id = :id")
    Optional<ZielortData> findByIdAsData(@Param("id") Long id);

    @Query("select z from Zielort z join z.traeger t where t.id = :traegerId and z.aktiv = true")
    List<ZielortData> findAllByTraegerId(@Param("traegerId") Long traegerId);

    Optional<ZielortData> findByIdAndAktivIsTrue(Long id);

    @Query("select z.auto from Zielort z where z.id = :id")
    boolean isAutomated(@Param("id") Long id);

    @Modifying(clearAutomatically = true)
    @Query("update Zielort z set z.name = :name where z.id = :id")
    void updateName(@Param("id") Long id, @Param("name") String name);

    @Modifying
    @Query("update Zielort z set z.aktiv = false where z.id = :id")
    void deactivate(@Param("id") Long id);

    @Modifying(clearAutomatically = true)
    @Query("update Zielort z set z.erfasst = true where z.id = :id")
    void lock(@Param("id") Long id);

    @Query("select z.id from Zielort z join z.traeger t where t.id = :traegerId and z.eingang = true")
    Optional<Long> findWareneingangByTraegerId(@Param("traegerId") Long traegerId);

    @Query("select z.id from Zielort z join z.traeger t where t.id = :traegerId and z.lager = true")
    Optional<Long> findLagerByTraegerId(@Param("traegerId") Long traegerId);
}
